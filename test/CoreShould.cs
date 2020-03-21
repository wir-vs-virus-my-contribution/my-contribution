using Microsoft.Extensions.Configuration;
using Xunit;

namespace MyContribution.Test
{
    public class CoreShould : BaseIntegrationTestClass
    {
        public CoreShould(CustomWebApplicationFactory<Startup> factory) : base(factory) { }

        [Fact]
        public void Not_Throw()
        {
            IConfiguration config = GetRequiredService<IConfiguration>();
        }
    }
}
