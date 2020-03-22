using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyContribution.Backend;

namespace App.Locations
{

    [Route("api/locations")]
    [ApiVersion("1.0")]
    public class LocationsController: ControllerBase
    {
        [HttpGet("coordinates-to-address")]
        public  Task<string> CoordinatesToAddreess(double longitude, double latitude)
        {
            return Task.FromResult(API.GetName("" + longitude, "" + latitude));
        }
    }
}
