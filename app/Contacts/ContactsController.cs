using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyContribution.Contacts
{

    [Route("api/contacts")]
    [ApiController]
    [ApiVersion("1.0")]
    public class ContactsController : ControllerBase
    {
        private readonly DataContext ctx;

        public ContactsController(DataContext ctx)
        {
            this.ctx = ctx;
        }

        [HttpGet("{key}")]
        public async Task<Contact> Get(Guid key)
        {
            return await ctx.Contacts.SingleAsync(v => v.Id == key);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Contact>> CreateContact(Contact contact)
        {
            ctx.Contacts.Add(contact);
            await ctx.SaveChangesAsync();

            return Created("odata/Contacts", contact);
        }
    }
}
