using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Services;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Talent.Services.Listing
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Explicitly add launchSettings.json and build the configuration
            var config = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("Properties/launchSettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .AddCommandLine(args)
                .Build();

            // Get the URLs from the configuration (no default, so no port is hardcoded)
            var hostUrl = config["ASPNETCORE_URLS"]
                ?? throw new InvalidOperationException("ASPNETCORE_URLS is not set. Configure it in Properties/launchSettings.json or as an environment variable.");

            ServiceHost.Create<Startup>(args, hostUrl)
               // .UseRabbitMq()
                .Build()
                .Run();
        }
    }
}
