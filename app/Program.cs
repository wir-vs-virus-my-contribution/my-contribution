using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Bogus;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.Extensions.DependencyInjection;
using MyContribution.Contacts;
using Serilog;
using Serilog.Core;

namespace MyContribution
{
    public class Program
    {
        private static string EnvironmentName
        {
            get
            {
                return Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            }
        }

        public static IConfiguration Configuration
        {
            get
            {
                return new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                    .AddJsonFile($"appsettings.{EnvironmentName}.json", optional: true, reloadOnChange: true)
                    .AddEnvironmentVariables()
                    .Build();
            }
        }

        private static Logger GetPreStartLogger()
        {
            return EnvironmentName == "Production"
                ? new LoggerConfiguration()
                    .WriteTo.RollingFile("logs/log-start-{Date}.txt")
                    .CreateLogger()
                : new LoggerConfiguration()
                    .WriteTo.Console()
                    .CreateLogger();
        }

        public static int Main(string[] args)
        {
            Log.Logger = GetPreStartLogger();
            string name = typeof(Program).Namespace;
            Log.Information($"Starting {name}");

            try
            {
                Log.Logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(Configuration)
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Application", typeof(Program).Namespace)
                    .CreateLogger();

                Log.Information($"Build host {name}");
                IWebHost host = CreateWebHostBuilder(args).Build();

                using (IServiceScope scope = host.Services.CreateScope())
                {
                    DataContext db = scope.ServiceProvider.GetRequiredService<DataContext>();
                    db = scope.ServiceProvider.GetRequiredService<DataContext>();
                    if (EnvironmentName == "Development" || EnvironmentName == "Test")
                    {
                        db.Database.EnsureCreated();

                        char[] gender = new[] { 'm', 'f', 'd' };

                        Field[] fields = new[]
                        {
                            new Field{ Id=Guid.NewGuid(), Description = "",Title ="" },
                            new Field{ Id=Guid.NewGuid(),Description = "",Title ="" },
                            new Field{ Id=Guid.NewGuid(),Description = "",Title ="" },
                            new Field{ Id=Guid.NewGuid(),Description = "",Title ="" },
                        };

                        Skill[] skills = new[]
                        {
                            new Skill{Id=Guid.NewGuid(),Title=""},
                            new Skill{Id=Guid.NewGuid(),Title=""},
                            new Skill{Id=Guid.NewGuid(),Title=""},
                            new Skill{Id=Guid.NewGuid(),Title=""},
                        };

                        //var fields = new[] { "Krankenhaus", "Pflege", "Botendienste", "Seelsorge", "Nichts Spezielles" };
                        //var skills = new[] { "Blut", "banana", "orange", "strawberry", "kiwi" };
                        Faker faker = new Faker();
                        List<Offer> offers = new Faker<Offer>()
                            .RuleFor(v => v.Id, f => Guid.NewGuid())
                            .RuleFor(v => v.Name, f => f.Person.FullName)
                            .RuleFor(v => v.Gender, f => f.PickRandom(gender))
                            //.RuleFor(v => v.Fields, f => Enumerable.Range(1, f.Random.Int(1, 3)).Select(x => new Offer_Field() { FieldId = f.PickRandom(fields).Id }).ToList())
                            .RuleFor(v => v.Entfernung, f => f.Random.Decimal((decimal) 0.1, 100))
                              //.RuleFor(v => v.Skills, f => Enumerable.Range(1, f.Random.Int(1, 3)).Select(x => new Offer_Skill() { SkillId = f.PickRandom(skills).Id }).ToList())
                            .Generate(1000);

                        foreach (Offer offer in offers)
                        {
                            offer.Skills = Enumerable.Range(1, faker.Random.Int(1, 3)).Select(x => new Offer_Skill() { OfferId = offer.Id, SkillId = faker.PickRandom(skills).Id }).Distinct().ToList();
                            offer.Fields = Enumerable.Range(1, faker.Random.Int(1, 3)).Select(x => new Offer_Field() { OfferId = offer.Id, FieldId = faker.PickRandom(fields).Id }).Distinct().ToList();
                        }

                        db.Skills.AddRange(skills);
                        db.Fields.AddRange(fields);

                        db.SaveChanges();
                        db.Offers.AddRange(offers);
                        db.SaveChanges();
                    }
                    else
                    {
                        db.Database.Migrate();
                    }
                }

                host.Run();
                return 0;

            }
            catch (Exception e)
            {
                Log.Fatal(e, "Host terminated unexpectedly");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            return new WebHostBuilder()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseKestrel()
                .UseIISIntegration()
                .UseStartup<Startup>()
                .ConfigureAppConfiguration((context, config) =>
                {
                    IConfigurationRoot cfg = config.Build();
                    string name = cfg.GetValue<string>("KeyVaultName");

                    if (context.HostingEnvironment.IsProduction() && !string.IsNullOrEmpty(name))
                    {
                        string keyvaultDns = $"https://{name}.vault.azure.net/";
                        Log.Information("Using KeyVault {KeyVault}", keyvaultDns);
                        AzureServiceTokenProvider azureServiceTokenProvider = new AzureServiceTokenProvider();
                        KeyVaultClient keyVaultClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));
                        config.AddAzureKeyVault(keyvaultDns, keyVaultClient, new DefaultKeyVaultSecretManager());
                    }
                    else
                    {
                        Log.Information("No KeyVault configured");
                    }
                })
                .UseConfiguration(Configuration)
                .UseSerilog();
        }
    }
}
