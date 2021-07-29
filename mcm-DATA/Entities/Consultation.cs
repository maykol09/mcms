using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Entities
{
    public class Consultation
    {
        public int person_id { get; set; }
        public int consultation_id { get; set; }
        public string staff { get; set; }
        public string staff_category { get; set; }
        public string complaints { get; set; }
        public string diagnosis { get; set; }
        public string treatment { get; set; }
        public string consulted_by { get; set; }
        public DateTime date_consulted { get; set; }
        public string user_name { get; set; }
        public string action { get; set; }

        public List<Medication> medicine { get; set; }
    }
}
