using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyContribution.Backend
{
    public class Search
    {
        public AddressRequest Address { get; set; }
        public Guid SelectedField { get; set; }
        public Guid[] Skills { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class OfferController : ControllerBase
    {
        private readonly DataContext ctx;

        public OfferController(DataContext ctx)
        {
            this.ctx = ctx;
        }

        [HttpGet("fields")]
        public async Task<IEnumerable<Field>> Fields()
        {
            return await ctx.Fields.Include(v => v.Skills).ToListAsync();
        }

        [HttpGet("{key}")]
        public async Task<Offer> Get(Guid key)
        {
            return await ctx.Offers.SingleAsync(v => v.Id == key);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Offer>> Create(OfferRequest request)
        {
            Guid offerId = Guid.NewGuid();
            Offer offer = new Offer()
            {
                Name = request.Name,
                Fields = request.Fields.Select(v => new Offer_Field { OfferId = offerId, FieldId = v }).ToList(),
                Skills = request.Skills.Select(v => new Offer_Skill { OfferId = offerId, SkillId = v }).ToList(),   //Kann null sein!!
                Gender = request.Gender,
                DateOfBirth = request.Age != null ? DateTime.UtcNow.AddYears(-request.Age.Value) : null as DateTime?,
                Phone = request.Phone,
                Email = request.Email,
                LastWorked = request.LastWorked,
                AvailableFrom = request.AvailableFrom,
                CoronaPassed = request.CoronaPassed,
                Address = request.Address,
                Radius = request.Radius,
                Comment = request.Comment,
                Distance = new Random().Next(1, 100)
            };
            ctx.Offers.Add(offer);
            await ctx.SaveChangesAsync();
            return Created("odata/Contacts", offer);
        }

        [HttpPost("edit")]
        public async Task<ActionResult<Offer>> Edit(OfferRequest request)
        {
            Guid offerId = request.Id;
            Offer offer = ctx.Offers.Find(offerId);
            offer.Name = request.Name;
            offer.Fields = request.Fields.Select(v => new Offer_Field { OfferId = offerId, FieldId = v }).ToList();
            offer.Skills = request.Skills.Select(v => new Offer_Skill { OfferId = offerId, SkillId = v }).ToList();   //Kann null sein!!
            offer.Gender = request.Gender;
            offer.DateOfBirth = request.Age != null ? DateTime.UtcNow.AddYears(-request.Age.Value) : null as DateTime?;
            offer.Phone = request.Phone;
            offer.Email = request.Email;
            offer.LastWorked = request.LastWorked;
            offer.AvailableFrom = request.AvailableFrom;
            offer.CoronaPassed = request.CoronaPassed;
            offer.Address = request.Address;
            offer.Radius = request.Radius;
            offer.Comment = request.Comment;
            offer.Entfernung = new Random().Next(1, 100);

            await ctx.SaveChangesAsync();

            return Ok(offer);
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<Offer>>> Search(Search search)
        {
            Guid selectedField = search.SelectedField;
            Guid[] skills = search.Skills;

            int start = 0;
            Guid krankenHausId = Guid.NewGuid();
            IQueryable<Offer> searchResultAll = ctx.Offers
                .Include(v => v.Fields)
                .ThenInclude(v => v.Field)
                .Include(v => v.Skills)
                .ThenInclude(v => v.Skill)
                .Where(v => v.Fields.Any(p => p.FieldId == selectedField));
            IQueryable<Offer> skillmatch = searchResultAll.Where(v => v.Skills.Any(p => skills.Any(o => p.SkillId == o)));
            searchResultAll = searchResultAll.Where(v => v.Skills.All(p => skills.All(o => p.SkillId != o)));
            //searchResultAll = searchResultAll.Except(skillmatch);
            skillmatch = skillmatch.OrderBy(v => v.Distance - start);
            searchResultAll = searchResultAll.OrderBy(v => v.Distance - start);
            List<Offer> resultList = await skillmatch.Take(10).ToListAsync();
            resultList.AddRange(await searchResultAll.Take(10).ToListAsync());
            return Ok(resultList);
        }

    }
}
