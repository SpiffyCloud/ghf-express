<svelte:head>
    <title>GHF Express</title>
</svelte:head>

<script lang="ts">
    import "../app.css";
    import JsBarcode from "jsbarcode";
    import { tick, onMount } from "svelte";
    import { SplashScreen } from "@capacitor/splash-screen";
    import { Preferences } from "@capacitor/preferences";
    import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
    import { App } from "@capacitor/app";
    import { Share } from "@capacitor/share";

    const initialBarcode = "";
    const emptyBarcodeChar = "•";
    let appVersion: string = $state("");
    let barcode: string = $state(initialBarcode);
    let displayBarcode = $state(false);
    let isValidBarcode = $derived(new RegExp(`^(\\d+)$`).test(barcode));
    let isEmptyBarcode = $derived(new RegExp(`^${emptyBarcodeChar}+$`).test(barcode));
    let position = $state(0);
    
    $effect(() => {
        if (barcode === initialBarcode && !displayBarcode) {
            barcode = emptyBarcodeChar.repeat(6);
        }
    })

    onMount(async () => {
        const { value } = await Preferences.get({ key: "barcode" });
        if (value) {
            barcode = value;
            renderBarcode();
        } else {
            barcode = initialBarcode;
            displayBarcode = false;
        }
        appVersion = await getAppVersion();
        await SplashScreen.hide();
    })

    async function getAppVersion() {
        try {
            const { version } = await App.getInfo();
            return version;
        } catch (error) {
            return "?.?.?";
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
            displayBarcode = false;
        } else {
            await Preferences.set({ key: "barcode", value: barcode });
            renderBarcode();
        }
    }

    async function renderBarcode() {
        barcode === initialBarcode ? position = 0 : position = barcode.length - 1;
        displayBarcode = true;
        await tick();

        try {
            JsBarcode("#barcode", barcode, {
                format: "CODE39",
                width: 2,
                height: 110,
                displayValue: true,
                fontOptions: "",
                font: "Menlo",
                textAlign: "center",
                textPosition: "bottom",
                textMargin: 16,
                fontSize: 24,
                background: "white",
                lineColor: "black",
                margin: 16,
            });

            const svg = document.querySelector("#barcode");
            if (svg) {
                svg.querySelectorAll("rect").forEach((rect) => {
                    rect.setAttribute("rx", "2");
                    rect.setAttribute("ry", "2");
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async function deleteBarcode() {
        await Preferences.clear();
        barcode = initialBarcode;
        displayBarcode = false;
        position = 0;
    }

    async function showDeleteDialog() {
        const result = await ActionSheet.showActions({
            title: "Are you sure you want to delete your barcode?",
            options: [
                {
                    title: "Delete Barcode",
                    style: ActionSheetButtonStyle.Destructive,
                },
                {
                    title: "Cancel",
                    style: ActionSheetButtonStyle.Cancel,
                },
            ],
        });

        if (result.index === 0) {
            await deleteBarcode();
        }
    }

    async function shareApp() {
        try {
            await Share.share({
                title: "Share GHF Express",
                text: "Hey, check out the fastest way to get into GHF!",
                url: "https://apps.apple.com/us/app/ghf-express/id6737064794",
            });
        } catch (error) {
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
    <div class="z-50 relative h-screen flex justify-between flex-col">
        <header class="flex flex-col gap-10 justify-center py-24 -mb-14">
            <h1 class="font-bold text-3xl text-center">GHF Express</h1>
            <button aria-label="share" onclick={shareApp} class="w-12 h-12 flex items-center justify-center bg-navy-800 active:bg-navy-600 rounded-full absolute right-6 top-14 active:scale-95 transform ease-out touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="fill-white h-6 w-auto"><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/></svg>
            </button>
        </header>

        {#if displayBarcode}
            <!-- Barcode -->
            <div class="bg-white mx-auto rounded-2xl p-2">
                <svg id="barcode"></svg>
            </div>
            <div class="flex justify-between items-center mx-auto w-[304px] mt-4">
                <!-- Edit button -->
                <button onclick="{() => displayBarcode = false}" aria-label="edit barcode" class="active:scale-95 transform ease-out touch-manipulation w-36 py-4 px-4 flex justify-center items-center gap-2 rounded-xl bg-navy-800 active:bg-navy-600">
                    <svg class="h-4 w-auto" viewBox="0 0 200 201" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-white" d="M185.982 7.2028L193.485 14.7053C202.172 23.3923 202.172 37.2127 193.485 45.8997L181.639 57.7457L142.942 19.0488L154.788 7.2028C163.475 -1.48427 177.295 -1.48427 185.982 7.2028ZM67.9171 94.0735L133.86 28.1307L172.557 66.8277L106.614 132.77C104.245 135.14 101.086 137.114 97.927 138.299L62.7838 149.75C59.6249 150.934 55.6762 150.145 53.307 147.38C50.5429 145.011 49.7532 141.063 50.9378 137.904L62.3889 102.761C63.5735 99.6016 65.5479 96.4427 67.9171 94.0735ZM37.9072 23.7872H75.8144C82.5271 23.7872 88.4501 29.7102 88.4501 36.4229C88.4501 43.5305 82.5271 49.0587 75.8144 49.0587H37.9072C30.7996 49.0587 25.2715 54.9817 25.2715 61.6944V162.78C25.2715 169.888 30.7996 175.416 37.9072 175.416H138.993C145.706 175.416 151.629 169.888 151.629 162.78V124.873C151.629 118.16 157.157 112.237 164.265 112.237C170.977 112.237 176.9 118.16 176.9 124.873V162.78C176.9 183.708 159.921 200.688 138.993 200.688H37.9072C16.9793 200.688 0 183.708 0 162.78V61.6944C0 40.7665 16.9793 23.7872 37.9072 23.7872Z"/>
                    </svg>
                    Edit
                </button>
                <!-- Delete button -->
                <button onclick={showDeleteDialog} aria-label="delete barcode" class="active:scale-95 transform ease-out touch-manipulation w-36 py-4 px-6 flex justify-center items-center gap-2 rounded-xl bg-navy-800 active:bg-navy-600">
                    <svg class="h-4 w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path class="fill-white" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                    Delete
                </button>
            </div>
            <!-- Spiffy footer -->
            <footer class="py-10 text-center">
                <script src="/htmx.min.js"></script>
                <div hx-get="https://spiffycloud.myusc.net/ghfexpress/partials/banner.html" hx-trigger="load" hx-swap="outerHTML" class="flex flex-col items-center gap-2 text-xs">
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
                </div>
                <p class="pt-3 text-sm">v{appVersion}</p>
            </footer>
        {:else}
            {#snippet digit(value: string | undefined, index: number)} 
            <button type="button" aria-label="id number" class="focus:bg-navy-600 focus:animate-blink bg-navy-800 outline-none text-4xl font-bold py-4 w-12 text-center rounded-lg {value === emptyBarcodeChar ? 'text-white/30' : 'text-white'} {index === position ? ' animate-blink' : ''}" onclick={() => position = index}>{value}</button>
            {/snippet}
            
            {#snippet keypadButton(value: string)}
            <button class="justify-stretch p-4 rounded-md text-2xl font-bold bg-navy-600 active:scale-90 active:bg-navy-800 transform ease-out touch-manipulation" onclick={() => updateBarcode(value)}>{value}</button>
            {/snippet}
        
            <!-- Digit Boxes -->
            <p class="text-center pb-4">Enter your membership ID</p>
            <div class="flex flex-row gap-2 justify-center w-full">
                {#each Array(6) as _, i}
                    {@render digit(barcode[i], i)}
                {/each}
            </div>
            <!-- Keypad -->
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
