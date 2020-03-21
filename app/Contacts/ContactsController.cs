using System;
using System.Linq;
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

        // /api/contacts/create?api-version=1.0
        [HttpPost("create")]
        public async Task<ActionResult<Contact>> CreateContact(Contact contact)
        {
            ctx.Contacts.Add(contact);
            await ctx.SaveChangesAsync();

            return contact;
        }

        [HttpPost("createO")]
        public async Task<ActionResult<Contact>> CreateOffer(OfferRequest request)
        {
            Guid offerId = Guid.NewGuid();
            Offer offer = new Offer()
            {
                Name = request.Name,
                Fields = request.Fields.Select(v => new Offer_Field { OfferId = offerId, FieldId = v })
            };
            ctx.Offers.Add(offer);
            await ctx.SaveChangesAsync();

            return Created("odata/Contacts", offer);
        }
    }
}
