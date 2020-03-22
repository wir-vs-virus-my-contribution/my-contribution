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
using MyContribution.Backend;
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
                    if (EnvironmentName == "Development" || EnvironmentName == "Test" || EnvironmentName == "Production")
                    {
                        db.Database.EnsureCreated();

                        char[] gender = new[] { 'm', 'f', 'd' };

                        Field[] fields = new[]
                        {
                              new Field
                              {
                                  Description = "", Title = "Pflege",
                                  Skills = new[]
                                  {
                                      new Skill { Title = "Intensiv" },
                                      new Skill { Title = "Blutabnahme" },
                                      new Skill { Title = "Screening" },
                                      new Skill { Title = "Röntgen" },
                                      new Skill { Title = "Dokumente" },
                                      new Skill { Title = "IV Medikamente" },
                                      new Skill { Title = "ECMO" },
                                      new Skill { Title = "Dyalisegeräte" },
                                      new Skill { Title = "Beatmungsgeräte" },
                                      new Skill { Title = "Basis Hygienemaßnahmen" },
                                      new Skill { Title = "Beatmung" },
                                      new Skill { Title = "Erste Hilfe" },
                                      new Skill { Title = "Triage" },
                                      new Skill { Title = "Strukturierte Anamnese" },
                                      new Skill { Title = "Atemwegsmgmt / Intubation" },
                                      new Skill { Title = "Zusatzqualifikation: Desinfektor" },
                                      new Skill { Title = "Instruktor" },
                                      new Skill { Title = "Altenpfleger" },
                                      new Skill { Title = "Sonstiges" }
                                }
                            },
                            new Field
                            {
                                Description = "", Title = "Krankenhaus",
                                Skills = new[]
                                {
                                    new Skill { Title = "Pflegehilfskraft/-assistenz" },
                                    new Skill { Title = "Fachkrankenpflege für Intensiv- und Anästhesiepflege" },
                                    new Skill { Title = "Exam. Gesundheits-/ und Krankenpfleger:in" },
                                    new Skill { Title = "Arz/Ärztin" },
                                    new Skill { Title = "Gesundheits-/ und Krankenpfleger/in in der Ausbildung" },
                                    new Skill { Title = "Medinzinstudent:in" },
                                    new Skill { Title = "Rettungssanitäter" },
                                    new Skill { Title = "Rettungsassistent" },
                                    new Skill { Title = "Notfallsanitäter" },
                                    new Skill { Title = "Facharzt" },
                                    new Skill { Title = "Sonstiges" }
                                }
                            },
                            new Field
                            {
                                Description = "",
                                Title = "Notdienst",
                                Skills = new[]
                                {
                                    new Skill { Title = "Santitäter" }
                                }
                            },
                            new Field { Description = "", Title = "Sonstiges", Skills = new List<Skill>() },
                            new Field
                            {
                                Description = "",
                                Title = "Seelsorge",
                                Skills = new []
                                {
                                    new Skill { Title = "Telefonseelsorge"}
                                }
                            },
                            new Field
                            {
                                Description = "",
                                Title = "Praxis",
                                Skills = new []
                                {
                                    new Skill { Title = "Assistenz" },
                                    new Skill { Title = "Verwaltung" },
                                }
                            },
                            new Field
                            {
                                Description = "",
                                Title = "Botendienst",
                                Skills = new []
                                {
                                    new Skill  { Title = "Führerschein" }
                                }
                            },
                        };

                        Faker faker = new Faker();
                        List<Offer> offers = new Faker<Offer>()
                            .RuleFor(v => v.Id, f => Guid.NewGuid())
                            .RuleFor(v => v.Name, f => f.Person.FullName)
                            .RuleFor(v => v.Gender, f => f.PickRandom(gender))
                            .RuleFor(v => v.CoronaPassed, f => f.Random.Bool())
                            .RuleFor(v => v.Distance, f => f.Random.Decimal((decimal) 0.1, 100))
                            .RuleFor(v => v.Experience, f => "" + f.Random.Number(1, 15))
                            .RuleFor(v => v.AvailableFrom, f => f.PickRandom(new[] { "Vollzeit", "Nachmittags", "Vormittags", "Nachtschicht" }))
                            .RuleFor(v => v.Address, f => f.Address.FullAddress())
                            .RuleFor(v => v.Comment, f => f.Lorem.Paragraph())
                            .RuleFor(v => v.Email, f => f.Person.Email)
                            .RuleFor(v => v.Phone, f => f.Person.Phone)
                            .RuleFor(v => v.DateOfBirth, f => DateTime.Now)
                            .Generate(200);

                        foreach (Offer offer in offers)
                        {
                            offer.Skills = Enumerable.Range(1, faker.Random.Int(1, 3)).Select(x => new Offer_Skill()
                            {
                                OfferId = offer.Id,
                                SkillId = faker.PickRandom(fields.SelectMany(v => v.Skills)).Id
                            }).Distinct().ToList();
                            offer.Fields = Enumerable.Range(1, faker.Random.Int(1, 3)).Select(x => new Offer_Field()
                            {
                                OfferId = offer.Id,
                                FieldId = faker.PickRandom(fields).Id
                            }).Distinct().ToList();
                        }

                        //db.Skills.AddRange(skills);
                        db.Fields.AddRange(fields);

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
