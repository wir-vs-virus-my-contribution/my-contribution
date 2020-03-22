using System;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyContribution.Backend
{
    public class API
    {
        private const string URL = "https://nominatim.openstreetmap.org";
        private static string urlParameters = "?format=json&limit=1";

        public static (string, string) GetLongLat(string address)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(URL);
            string lon = "";
            string lat = "";

            // Add an Accept header for JSON format.
            client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

            client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0");

            // List data response.
            HttpResponseMessage response = client.GetAsync("/search/" + address + urlParameters).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
            if (response.IsSuccessStatusCode)
            {
                // Parse the response body.
                string data = response.Content.ReadAsStringAsync().Result;
                if (data != null && data != "")
                {
                    JArray json = JArray.Parse(data);
                    foreach (JObject parsedObject in json.Children<JObject>())
                    {
                        foreach (JProperty parsedProperty in parsedObject.Properties())
                        {
                            string propertyName = parsedProperty.Name;
                            if (propertyName.Equals("lon"))
                            {
                                lon = (string) parsedProperty.Value;
                            }
                            else if (propertyName.Equals("lat"))
                            {
                                lat = (string) parsedProperty.Value;
                            }
                        }
                    }
                }
            }

            //Make any other calls using HttpClient here.

            //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
            client.Dispose();
            return (lon, lat);
        }

        public static string GetName(string lon, string lat)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(URL);
            string result = "";

            // Add an Accept header for JSON format.
            client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

            client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0");

            // List data response.
            HttpResponseMessage response = client.GetAsync("/reverse?format=json&lat=" + lat + "&lon=" + lon).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
            if (response.IsSuccessStatusCode)
            {
                // Parse the response body.
                string data = response.Content.ReadAsStringAsync().Result;
                if (data != null && data != "")
                {
                    var obj = JsonConvert.DeserializeObject<JObject>(data);
                    result = obj["address"]["road"] + " " + obj["address"]["house_number"] + ", " + obj["address"]["postcode"] + " " + obj["address"]["city"] + ", " + obj["address"]["country"];

                }
            }

            //Make any other calls using HttpClient here.

            //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
            client.Dispose();
            return result;
        }
    }
}
