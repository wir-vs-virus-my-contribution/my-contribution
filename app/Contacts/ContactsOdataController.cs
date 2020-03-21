using System;
using System.Linq;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;

namespace my_contribution.Contacts
{
    [ODataRoutePrefix("Contacts")]
    [ApiVersion("1.0")]
    public class ContactsOdataController : ODataController
    {
        private readonly DataContext ctx;

        public ContactsOdataController(DataContext ctx)
        {
            this.ctx = ctx;
        }

        [ODataRoute("{key}")]
        [EnableQuery]
        public SingleResult<Contact> Get(Guid key)
        {
            return new SingleResult<Contact>(ctx.Contacts.Where(v => v.Id == key));
        }

        [ODataRoute]
        [EnableQuery]
        public IQueryable<Contact> Get()
        {
            return ctx.Contacts;
        }
    }
}
