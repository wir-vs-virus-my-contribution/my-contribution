using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyContribution.Backend
{

    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext ctx;

        public AccountController(DataContext ctx)
        {
            this.ctx = ctx;
        }

        [HttpGet("{key}")]
        public async Task<Account> Get(Guid key)
        {
            return await ctx.Accounts.SingleAsync(v => v.Id == key);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Account>> CreateAccount(AccountRequest request)
        {
            var (tlon, tlat) = API.GetLongLat("Unter den Linden, 1, Berlin");
            var (t2lon, t2lat) = API.GetLongLat("akjsgbfkjagshfjkahslkf");
            var test = API.GetName(tlon, tlat);
            Account acc = new Account()
            {
                Username = request.Username,
                Institution = request.Institution,
                PassHash = SHA.GenerateSHA512String(request.Password),
                Email = request.Email,
                Address = request.Address,
                TimeOfRegister = DateTime.Now
            };
            ctx.Accounts.Add(acc);
            await ctx.SaveChangesAsync();

            return Created("odata/Contacts", acc);
        }

    }
}
