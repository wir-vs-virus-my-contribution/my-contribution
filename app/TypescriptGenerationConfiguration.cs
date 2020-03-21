using System;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;

namespace my_contribution
{
    public class TypescriptGenerationConfiguration
    {
        public static void Configure(ConfigurationBuilder builder)
        {
            builder.Global(options =>
            {
                options.CamelCaseForProperties(true);
                options.UseModules(true);
            });

            builder.ExportAsInterface<Contacts.Contact>()
                .WithPublicProperties()
                .Substitute(typeof(Guid), new RtSimpleTypeName("string"))
                .OverrideNamespace("contacts")
                .AutoI(false);
        }
    }
}
