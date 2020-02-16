using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

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
        public static void AddPagination(this HttpResponse response,
                int CurentPage, int ItemsPerPage, int TotalItems, int TotalPages)
        {
            var page = new PaginationHeader(CurentPage, ItemsPerPage, TotalItems, TotalPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(page, camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
           
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