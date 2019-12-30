using System;
using Microsoft.AspNetCore.Http;

namespace datingapp.api.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Applicaion-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Applicaion-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }

        public static int CalculateAge(this DateTime theDatetime)
        {
            var age = DateTime.Now.Year - theDatetime.Year;
            if (theDatetime.AddYears(age) < DateTime.Now)
                age--;
            return age;    
        }
    }
}