using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Entities
{
    public class Medication
    {
        public int med_id { get; set; }
        public int consult_med_id { get; set; }
        public int person_id { get; set; }
        public int consultation_id { get; set; }

        public string medicine { get; set; }
        public int quantity { get; set; }
        public string dosage { get; set; }
        public DateTime date_given { get; set; }
        public string action { get; set; }
        public string user { get; set; }

        public string staff { get; set; }
        public string staff_category { get; set; }
        public string diagnosis { get; set; }
        public int is_active { get; set; }
        public int onhand { get; set; }
    }
}
