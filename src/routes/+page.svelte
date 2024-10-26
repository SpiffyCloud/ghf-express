<svelte:head>
    <title>GHF Express</title>
</svelte:head>

<script lang="ts">
    import "../app.css";
    import JsBarcode from 'jsbarcode';
    import { tick, onMount } from 'svelte';
    import { SplashScreen } from "@capacitor/splash-screen";
    import { Preferences } from "@capacitor/preferences";
    import { App } from '@capacitor/app';

    const initialBarcode = 'Tap to edit';
    const emptyBarcodeChar = '•';
    let appVersion: string = $state('');
    let barcode: string = $state(initialBarcode);
    let displayBarcode = $state(true);
    let isValidBarcode = $derived(new RegExp(`^(\\d+|${emptyBarcodeChar}+)$`).test(barcode));
    let isEmptyBarcode = $derived(new RegExp(`^${emptyBarcodeChar}+$`).test(barcode));
    let position = $state(0);
    
    $effect(() => {
        if (barcode === initialBarcode && !displayBarcode) {
            barcode = emptyBarcodeChar.repeat(6);
        }
    })

    onMount(async () => {
        const { value } = await Preferences.get({ key: 'barcode' });
        if (value) {
            barcode = value;
            renderBarcode();
        } else {
            barcode = initialBarcode;
            renderBarcode("CODE128", 16);
        }
        appVersion = await getAppVersion();
        await SplashScreen.hide();
    })

    async function getAppVersion() {
        try {
            const { version } = await App.getInfo();
            return version;
        } catch (error) {
            return '?.?.?';
        }
    }

    function updateBarcode(value: string) {
        barcode = barcode.slice(0, position) + value + barcode.slice(position + 1);
        if (position < 5) {
            position++;
        }
    }

    function deleteDigitFromBarcode() {
        barcode = barcode.slice(0, position) + emptyBarcodeChar + barcode.slice(position + 1);
        if (position > 0 && barcode[position] === emptyBarcodeChar) {
            position--;
        }
    }

    async function saveBarCode() {
        if (isEmptyBarcode) {
            await Preferences.clear();
            barcode = initialBarcode;
            renderBarcode("CODE128", 16);
        } else {
            await Preferences.set({ key: 'barcode', value: barcode });
            renderBarcode();
        }
    }

    async function renderBarcode(format: string = "CODE39", fontSize: number = 24) {
        barcode === initialBarcode ? position = 0 : position = barcode.length - 1;
        displayBarcode = true;
        await tick();

        try {
            JsBarcode('#barcode', barcode, {
                format,
                width: 2,
                height: 110,
                displayValue: true,
                fontOptions: "",
                font: "Menlo",
                textAlign: "center",
                textPosition: "bottom",
                textMargin: 16,
                fontSize,
                background: "white",
                lineColor: "#093565",
                margin: 10,
            });

            const svg = document.querySelector('#barcode');
            if (svg) {
                svg.querySelectorAll('rect').forEach((rect) => {
                    rect.setAttribute('rx', '2');
                    rect.setAttribute('ry', '2');
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }
</script>

<div class="relative w-screen h-screen bg-navy-900 text-white select-none">
    <!-- Background visuals -->
    <div class="absolute top-0 left-0 max-w-[75vw] max-h-[25vh]">
        <svg viewBox="0 0 881 540" fill="none" class="w-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.759426 0L0.759399 540C487.417 540 755.777 370 880.759 0.000136538L0.759426 0Z" class="fill-navy-800"/>
            <path d="M0.759426 0L0.75946 436C316.378 338.808 490.665 203.467 578.759 0.000106021L0.759426 0Z" class="fill-navy-600"/>
        </svg>
    </div>
    <div class="absolute bottom-0 right-0 max-w-[75vw] max-h-[25vh]">
        <svg viewBox="0 0 925 496" fill="none" class="w-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M924.128 496V0C413.138 0 131.36 156.148 0.128174 496H924.128Z" class="fill-navy-800"/>
            <path d="M924.128 496V95C587.892 95 402.48 221.241 316.128 496H924.128Z" class="fill-navy-600"/>
        </svg>
    </div>

    <!-- Main content -->
    <div class="z-50 relative flex flex-col items-center justify-between h-screen">
        <header class="flex justify-center pb-24 pt-32 -mb-14">
            <h1 class="font-bold text-3xl">GHF Express</h1>
        </header>

        <main class="w-full px-4 flex flex-col items-center">
            <!-- Barcode -->
            {#if displayBarcode}
            <button onclick="{() => displayBarcode = false}" aria-label="edit barcode" class="active:scale-95 transform ease-out touch-manipulation">
                <div class="bg-white mx-auto rounded-md p-2 max-w-[20rem] shadow-[0px_16px_16px_rgba(0,0,0,0.4)]">
                    <svg id="barcode" class="w-full h-full"></svg>
                </div>
            </button>
            {:else}
            <!-- Digit Boxes -->
            {#snippet digit(value: string | undefined, index: number)} 
                <button type="button" aria-label="id number" class="focus:bg-navy-600 focus:animate-blink bg-navy-800 outline-none text-4xl font-bold py-4 w-12 text-center rounded-lg {value === emptyBarcodeChar ? 'text-white/30' : 'text-white'} {index === position ? ' animate-blink' : ''}" onclick={() => position = index}>{value}</button>
            {/snippet}

            <p class="text-center text-sm pb-4 ">Enter your membership ID</p>
            <div class="flex flex-row gap-2 justify-center w-full">
                {#each Array(6) as _, i}
                    {@render digit(barcode[i], i)}
                {/each}
            </div>
            {/if}
        </main>

        <!-- Branding footer -->
        {#if displayBarcode}
        <footer class="py-10 text-center">
            <a class="flex flex-col items-center gap-2 text-xs" href="https://github.com/SpiffyCloud/ghf-express" target="_blank">
                <svg viewBox="0 0 1018 734" class="w-9" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M842.982 240.492C844.565 230.746 845.384 220.785 845.384 210.657C845.384 94.4379 737.532 0.22345 604.493 0.22345C497.641 0.22345 407.036 60.9967 375.507 145.134C350.631 132.059 321.965 124.609 291.449 124.609C196.094 124.609 118.794 197.36 118.794 287.103C118.794 300.802 120.597 314.105 123.987 326.813C50.7043 360.977 -0.00390625 434.612 -0.00390625 519.94C-0.00390625 637.826 96.7796 733.391 216.169 733.391H801.823C921.213 733.391 1018 622.044 1018 484.69C1018 363.529 942.687 262.604 842.982 240.492ZM825.487 253.015C826.987 243.779 827.763 234.34 827.763 224.743C827.763 114.612 725.561 25.333 599.492 25.333C498.238 25.333 412.379 82.9225 382.502 162.651C358.929 150.262 331.765 143.202 302.847 143.202C212.488 143.202 139.238 212.142 139.238 297.184C139.238 310.165 140.946 322.771 144.159 334.813C74.715 367.187 26.6633 436.964 26.6633 517.823C26.6633 629.533 118.377 720.091 231.512 720.091H786.484C899.619 720.091 991.332 614.577 991.332 484.42C991.332 369.606 919.968 273.968 825.487 253.015Z" fill="white"
                    />
                    <path d="M518.629 363.126C518.629 422.565 476.722 536.172 352.53 536.172C262.484 536.172 220.835 481.409 220.835 413.855C220.835 326.351 250.083 291.538 352.53 291.538C425.263 291.538 518.629 295.573 518.629 363.126Z" fill="white"
                    />
                    <path d="M560.774 363.126C560.774 422.565 602.68 536.172 726.873 536.172C816.918 536.172 858.568 481.409 858.568 413.855C858.568 326.351 829.319 291.538 726.873 291.538C654.139 291.538 560.774 295.573 560.774 363.126Z" fill="white"
                    />
                    <path d="M633.282 552.972C575.393 613.964 527.682 614.259 443.134 590.509C502.592 639.694 611.111 639.18 633.282 552.972Z" fill="white"
                    />
                </svg>
                a spiffycloud project
            </a>
            <p class="pt-3 text-sm">v{appVersion}</p>
        </footer>
        {:else}
        <!-- Keypad -->
        {#snippet keypadButton(value: string)}
            <button class="justify-stretch p-4 rounded-md text-2xl font-bold bg-navy-600 active:scale-90 active:bg-navy-800 transform ease-out touch-manipulation" onclick={() => updateBarcode(value)}>{value}</button>
        {/snippet}

        <div class="bg-navy-900/40 backdrop-blur-sm w-full grid grid-cols-3 gap-2 px-6 pt-6 pb-10">
            <!-- 1-9 Buttons -->
            {#each Array(3) as _, i}
                {#each Array(3) as _, j}
                    {@render keypadButton((i*3+j+1).toString())}
                {/each}
            {/each}
            <!-- Backspace -->
            <button class="fill-white p-4 rounded-md active:scale-90 active:bg-navy-800 transform ease-out touch-manipulation disabled:opacity-50 disabled:pointer-events-none" aria-label="backspace" onclick={deleteDigitFromBarcode} disabled={position === 0 && barcode[position] === emptyBarcodeChar}>
                <svg class="w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
            </button>
            {@render keypadButton("0")}
            <!-- Save Button -->
            <button class="fill-white p-4 rounded-md active:scale-90 active:bg-navy-800 transform ease-out touch-manipulation disabled:pointer-events-none disabled:opacity-50" aria-label="save" onclick={saveBarCode} disabled={!isValidBarcode}>
                <svg class="w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
            </button>
        </div>
        {/if}
    </div>
</div>
