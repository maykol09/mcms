using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Entities
{
    public class PersonDetails
    {
        public int person_id { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string email { get; set; }
        public Nullable<DateTime> birth_date { get; set; }
        public string sub_unit_code { get; set; }
        public int? sfile_no { get; set; }
        public int age { get; set; }
        public string medical_exam_date { get; set; }
        public string allergy { get; set; }
        public string sis_employee_type { get; set; }
        public string user { get; set; }
        public string action { get; set; }
        public int? sis_person_id { get; set; }
    }
}
