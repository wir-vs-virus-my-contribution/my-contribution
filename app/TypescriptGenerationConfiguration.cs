using System;
using MyContribution.Backend;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;

namespace MyContribution
{
    public static class InterfaceExportBuilderExtensions
    {
        public static InterfaceExportBuilder<T> WithDefaults<T>(this InterfaceExportBuilder<T> builder)
        {
            return builder.WithPublicProperties()
                .Substitute(typeof(string), new RtSimpleTypeName("string|null"))
                .Substitute(typeof(Guid), new RtSimpleTypeName("string"))
                .Substitute(typeof(Guid?), new RtSimpleTypeName("string|null"))
                .Substitute(typeof(DateTime?), new RtSimpleTypeName("string|null"))
                .Substitute(typeof(DateTime), new RtSimpleTypeName("string"))
                .OverrideNamespace("helpers")
                .AutoI(false);
        }
    }

    public class TypescriptGenerationConfiguration
    {
        public static void Configure(ConfigurationBuilder builder)
        {
            builder.Global(options =>
            {
                options.CamelCaseForProperties(true);
                options.UseModules(true);
            });

            builder.ExportAsInterface<OfferRequest>()
                .WithDefaults();

            builder.ExportAsInterface<Offer>()
                .WithDefaults();
        }
    }
}
