

type baseEvent = {
    timestamp: number,
    type: pluginEventType
}

/**
 * The type of the event
 * 
 * The `install` event is triggered when the plugin is installed. 
 * The `activate` event is triggered when the plugin is activated. 
 */
type pluginEventType = 
"install" |
"activate" |
"deactivate" |
"uninstall"


type pluginEvent = baseEvent & {
    /**
     * The name of the plugin defined in the `manifest.json`.
     */
    name: string,
    /**
     * The version of the plugin defined in the `manifest.json`.
     */
    version: string
}

/*declare function CMS(): void;*/
/**
 * @since 0.0.1
 */
declare namespace CMS {
    /**
     * API for accessing the core
     * @since 0.0.1
     */
    namespace Core {
        /**
         * Access to the CMS version
         */
        const version: {
            major: number,
            minor: number,
            patch: number,
            /**
             * Creates a string representation of the version
             * @returns {string} The string representation of the version
             */
            toString: function(): string
        }
    }
    /**
     * API for logging in the console
     * @since 0.0.1
     */
    namespace Console {
        /**
         * Prints to `stderr` with newline. Multiple arguments can be passed, with the
         * first used as the primary message and all additional used as substitution
         * values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html) (the arguments are all passed to `util.format()`).
         *
         * ```js
         * const code = 5;
         * CMS.Console.error('error #%d', code);
         * // Prints: error #5, to stderr
         * CMS.Console.error('error', code);
         * // Prints: error 5, to stderr
         * ```
         *
         * If formatting elements (e.g. `%d`) are not found in the first string then `util.inspect()` is called on each argument and the resulting string
         * values are concatenated.
         * @since 0.0.1
         */
        function error(message?: any, ...optionalParams: any[]): void;
        /**
         * Prints to `stdout` with newline. Multiple arguments can be passed, with the
         * first used as the primary message and all additional used as substitution
         * values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html) (the arguments are all passed to `util.format()`).
         *
         * ```js
         * const count = 5;
         * CMS.Console.log('count: %d', count);
         * // Prints: count: 5, to stdout
         * CMS.Console.log('count:', count);
         * // Prints: count: 5, to stdout
         * ```
         *
         * @since 0.0.1
         */
        function log(message?: any, ...optionalParams: any[]): void;
    }
    /**
     * API for logging in the logs
     * @since 0.0.1
     */
    namespace Logger {
        function error(message: any): void;
        function log(message: any): void;
    }
    /**
     * API for the current plugin
     * @since 0.0.1
     */
    namespace Plugin {
        function on(
            /**
             * The type of the event
             * 
             * The `install` event is triggered when the plugin is installed. 
             * The `activate` event is triggered when the plugin is activated. 
             */
            eventType: pluginEventType,
            /**
             * The event handler for the event
             * @param pluginEvent The event object
             */
            eventHandler: function(pluginEvent)
        ): number
    }
    /**
     * API for interaction with other plugins
     * @since 0.0.1
     */
    namespace Plugins {
        function on(
            eventType: pluginEventType,
            eventHandler: function(pluginEvent)
        ): number
    }
}
