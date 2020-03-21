using System;
using System.Linq;
using System.Text;
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

        [HttpPost("createOffer")]
        public async Task<ActionResult<Offer>> CreateOffer(OfferRequest request)
        {
            Guid offerId = Guid.NewGuid();
            Offer offer = new Offer()
            {
                Name = request.Name,
                Fields = request.Fields.Select(v => new Offer_Field { OfferId = offerId, FieldId = v }).ToList(),
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth,
                Phone = request.Phone,
                Email = request.Email,
                LastWorked = ctx.RelativeTimes.Find(request.LastWorkedId),
                CoronaPassed = request.CoronaPassed,
                Address = request.Address,
                Radius = request.Radius,
                Comment = request.Comment
            };
            ctx.Offers.Add(offer);
            await ctx.SaveChangesAsync();

            return Created("odata/Contacts", offer);
        }

        [HttpPost("createAccount")]
        public async Task<ActionResult<Account>> CreateAccount(AccountRequest request)
        {
            Account acc = new Account()
            {
                Username = request.Username,
                Institution = request.Institution,
                PassHash = SHA.GenerateSHA512String(request.Password),
                Email = request.Email,
                Address = request.Address,
                TimeOfRegister = request.TimeOfRegister
            };
            ctx.Accounts.Add(acc);
            await ctx.SaveChangesAsync();

            return Created("odata/Contacts", acc);
        }
    }
}
