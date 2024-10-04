export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico"]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.DpdxUgz8.js","app":"_app/immutable/entry/app.B_SuSR17.js","imports":["_app/immutable/entry/start.DpdxUgz8.js","_app/immutable/chunks/entry.Arf63M3D.js","_app/immutable/chunks/runtime.aMMvh1H4.js","_app/immutable/entry/app.B_SuSR17.js","_app/immutable/chunks/preload-helper.DU57GtT2.js","_app/immutable/chunks/runtime.aMMvh1H4.js","_app/immutable/chunks/render.Z6BS0m-B.js","_app/immutable/chunks/disclose-version.DsA8IxDv.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
