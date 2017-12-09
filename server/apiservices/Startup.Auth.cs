using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using ApiService.Middleware;
using ApiService.Utils;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;

namespace ApiService
{
    public partial class Startup
    {
        // The secret key every token will be signed with.
        // Keep this safe on the server!
        private static readonly string secretKey = "mysupersecret_secretkey!123";

        private void ConfigureAuth(IApplicationBuilder app)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));

            app.UseSimpleTokenProvider(new TokenProviderOptions
            {
                Path = "/api/token",
                Audience = "ExampleAudience",
                Issuer = "ExampleIssuer",
                Expiration = TimeSpan.FromMinutes(24 * 60),
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
                IdentityResolver = GetIdentity
            });

            var tokenValidationParameters = new TokenValidationParameters
            {
                // The signing key must match!
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,

                // Validate the JWT Issuer (iss) claim
                ValidateIssuer = true,
                ValidIssuer = "ExampleIssuer",

                // Validate the JWT Audience (aud) claim
                ValidateAudience = true,
                ValidAudience = "ExampleAudience",

                // Validate the token expiry
                ValidateLifetime = true,

                // If you want to allow a certain amount of clock drift, set that here:
                ClockSkew = TimeSpan.Zero
            };

            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                TokenValidationParameters = tokenValidationParameters
            });

            //app.UseCookieAuthentication(new CookieAuthenticationOptions
            //{
            //    AutomaticAuthenticate = true,
            //    AutomaticChallenge = true,
            //    AuthenticationScheme = "Cookie",
            //    CookieName = "access_token",
            //    TicketDataFormat = new CustomJwtDataFormat(
            //        SecurityAlgorithms.HmacSha256,
            //        tokenValidationParameters)
            //});
        }

        private Task<ClaimsIdentity> GetIdentity(string username, string userSign)
        {
            //从数据库中读取对应用户的密码计算HMAC
            var sign = HmacHelper.HmacSha1ToBase64(username, "TEST123");
            Console.WriteLine(sign);
            // Don't do this in production, obviously!
            if (sign == userSign)
            {
                return Task.FromResult(new ClaimsIdentity(new GenericIdentity(username, "Token"), new Claim[] { }));
            }

            // Credentials are invalid, or account doesn't exist
            return Task.FromResult<ClaimsIdentity>(null);
        }
    }
}
