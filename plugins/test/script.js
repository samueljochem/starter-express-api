var hello = "Hello World! ";

CMS.Plugin.on("activate",function(e) {
    CMS.Console.log(e);
    CMS.Logger.log(
        hello + 
        "This plugin is now runnning with version " + 
        CMS.Core.version.toString() + "!"
    );
})
//CMS.User.on()