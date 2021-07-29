using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Entities
{
    public class Reference
    {
        public IReadOnlyCollection<LibMedicine> medicine { get; set; }
        public IReadOnlyCollection<LibSupplier> supplier { get; set; }
        public IReadOnlyCollection<LibReasonForVisit> reason { get; set; }
        public IReadOnlyCollection<LibUser> users { get; set; }
    }
    public class LibMedicine
    {
        public int med_id { get; set; }
        public string med_name { get; set; }
        public int onhand { get; set; }
        public Boolean is_active { get; set; }
    }
    public class LibSupplier
    {
        public string supplier_id { get; set; }
        public string supplier_name { get; set; }
    }
    public class LibReasonForVisit
    {
        public int reason_id { get; set; }
        public string reason { get; set; }
    }
    public class LibReference
    {
        public int ref_id { get; set; }
        public string ref_name { get; set; }
        public string ref_type { get; set; }
        public string ref_code { get; set; }
        public DateTime date_created { get; set; }
        public string user { get; set; }
        public string action { get; set; }
    }

    public class LibUser
    {
        public int person_id { get; set; }
        public string user_name { get; set; }
        public string name { get; set; }
    }
}
