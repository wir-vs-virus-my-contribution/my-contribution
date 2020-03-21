using System;
using System.Collections.Generic;
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

        [HttpPost("createOffer")]
        public async Task<ActionResult<Offer>> CreateOffer(OfferRequest request)
        {
            Guid offerId = Guid.NewGuid();
            Offer offer = new Offer()
            {
                Name = request.Name,
                Fields = request.Fields.Select(v => new Offer_Field { OfferId = offerId, FieldId = v }).ToList(),
                Skills = request.Skills.Select(v => new Offer_Skill { OfferId = offerId, SkillId = v }).ToList(),   //Kann null sein!!
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth,
                Phone = request.Phone,
                Email = request.Email,
                LastWorked = request.LastWorked,
                AvailableFrom = request.AvailableFrom,
                CoronaPassed = request.CoronaPassed,
                Address = request.Address,
                Radius = request.Radius,
                Comment = request.Comment,
                Entfernung = new Random().Next(1, 100)
            };
            ctx.Offers.Add(offer);
            await ctx.SaveChangesAsync();

            return Created("odata/Contacts", offer);
        }

        [HttpPost("createAccount")]
        public async Task<ActionResult<Account>> CreateAccount(AccountRequest request)
        {
            var test = Search(null, new Guid("3f9bfdd3-6f79-4301-aa26-dd6e3b92a420"), new Guid[] { new Guid("1b02ca8b-9858-426c-8c7c-0d88cd2bb94d") });
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

        public List<Offer> Search(AddressRequest adr, Guid selectedField, Guid[] skills)
        {
            var start = 0;
            var krankenHausId = Guid.NewGuid();
            var searchResultAll = ctx.Offers.Where(v => v.Fields.Any(p => p.FieldId == selectedField));
            var skillmatch = searchResultAll.Where(v => v.Skills.Any(p => skills.Any(o => p.SkillId == o)));
            searchResultAll = searchResultAll.Except(skillmatch);
            skillmatch = skillmatch.OrderBy(v => start - v.Entfernung); //Vorschreiben
            searchResultAll = searchResultAll.OrderBy(v => start - v.Entfernung);
            var resultList = skillmatch.ToList();
            resultList.AddRange(searchResultAll.ToList());
            return resultList;
        }

    }
}
