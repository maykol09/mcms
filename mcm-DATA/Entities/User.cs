using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Entities
{
    public class User
    {
        public string user_name { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public int user_level { get; set; }
        public Boolean has_access { get; set; }
    }
    public class UserAccess
    {
        public int user_id { get; set; }
        public string user_name { get; set; }
        public int user_level { get; set; }
        public string created_by { get; set; }
        public DateTime date_created { get; set; }
        public string action { get; set; }
    }
}
