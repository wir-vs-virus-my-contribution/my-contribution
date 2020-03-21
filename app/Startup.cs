using System.Linq;
using System.Net;
using AutoMapper;
using AutoMapper.EquivalencyExpression;
using MediatR;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNet.OData.Formatter;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Serilog;

namespace my_contribution
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IHostingEnvironment env, IConfiguration configuration)
        {
            Configuration = configuration;

            Log.Information("Configuring " + env.ApplicationName);
            Log.Information("Environment: " + env.EnvironmentName);
            Log.Information("ContentRoot: " + env.ContentRootPath);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.Formatting = Formatting.Indented;
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });

            services.AddVersionedApiExplorer(o => o.GroupNameFormat = "'v'VVV");

            services.AddApiVersioning(options =>
            {
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.ReportApiVersions = true;
            });
            services.AddOData().EnableApiVersioning();

            services.AddAutoMapper(cfg =>
            {
                cfg.AddCollectionMappers();
            });

            services.AddMediatR(typeof(Startup).Assembly);

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "web/build";
            });

            services.AddDbContext<DataContext>(options =>
            {
                options.UseInMemoryDatabase("dev-db");
            });
        }

        public void Configure(
            IApplicationBuilder app,
            IHostingEnvironment env,
            VersionedODataModelBuilder modelBuilder
        )
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseMvc(routes =>
            {
                routes.Select().Expand().Filter().OrderBy().MaxTop(100).Count();
                routes.MapVersionedODataRoutes("odata", "odata", modelBuilder.GetEdmModels());
                routes.EnableDependencyInjection();
            });

            foreach (string route in new string[] { "/api", "/odata" })
            {
                app.Map(route, builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int) HttpStatusCode.NotFound;
                        await context.Response.WriteAsync("");
                    });
                });
            }

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "web";

                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });
        }
    }
}
