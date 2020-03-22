using System;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MyContribution.Backend
{

    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext ctx;
        private readonly IConfiguration config;

        public AccountController(DataContext ctx, IConfiguration config)
        {
            this.ctx = ctx;
            this.config = config;
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
            MessageFromInstitution("Konsti", "konstantin.buy@online.de", "Kreiskrankenhaus EBE", "Praetoriusbogen 25 <br> 85560 Ebersberg", "Hey Konstantin,<br>wir brauchen dich. Und zwar jetzt!");
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

        public bool MessageFromInstitution(string name, string receiver, string nameInstitution, string contactInfo, string message) {
            return SendMail("Die Zeit für dein Heldentum ist gekommen!", GetFormattedMessageHTML(name, nameInstitution, contactInfo, message),receiver);
        }

        private bool SendMail(string subject, string body, string receiver)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient(config.GetValue<string>("SMTP_HOST"));

                mail.From = new MailAddress("noreply@corona-helden.net","Corona-Helden");
                mail.To.Add(receiver);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;

                SmtpServer.Port = Int16.Parse(config.GetValue<string>("SMTP_PORT"));
                SmtpServer.Credentials = new System.Net.NetworkCredential(config.GetValue<string>("SMTP_USER"), config.GetValue<string>("SMTP_PASS"));
                SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);
                return true;
            }
            catch (Exception ex)
            {
                //MessageBox.Show(ex.ToString());
                return false;
            }
        }

        private String GetFormattedMessageHTML(string name, string nameInstitution, string contactInfo, string message)
        {
            return "<!DOCTYPE html> " +
                "<html xmlns=\"http://www.w3.org/1999/xhtml\">" +
                "<head>" +
                    "<title>Email</title>" +
                "</head>" +
                "<body style=\"font-family:'Century Gothic'\">" +
                    "<h1 style=\"text-align:center;\"> Du bist ein Corona-Held und jetzt wirst du gebraucht!</h1>" +
                    "<h2 style=\"font-size:14px;\">" +
                        "Liebe(r) " + name + ", hier die Nachricht von: " + nameInstitution +
                    "</h2>" +
                    "<p>" + message + "</p>" +
                    "<p><i>" + contactInfo + "</i></p>" +
                "</body>" +
                "</html>";
        }
    }
}
