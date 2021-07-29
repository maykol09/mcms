using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Entities
{
    public class MedicineDetails
    {
        public int med_id { get; set; }
        public string med_code { get; set; }
        public string med_name { get; set; }
        public string med_class { get; set; }
        public string med_unit { get; set; }
        public int med_received { get; set; }
        public int med_issued { get; set; }
        public int? med_onhand { get; set; }
        public int? med_cost { get; set; }
        public int? reorder_qty { get; set; }
        public int? order_qty { get; set; }
        public Boolean is_active { get; set; }
        public string action { get; set; }
        public string user { get; set; }
    }
    public class ReceivedMedicine
    {
        public int si_med_id { get; set; }
        public int med_id { get; set; }
        public int si_id { get; set; }
        public DateTime? date_received { get; set; }
        public string med_name { get; set; }
        public int quantity { get; set; }
        public int cost { get; set; }
        public string remarks { get; set; }
        public string user { get; set; }
        public string action { get; set; }
    }
    public class IssuedMedicine
    {
        public int med_id { get; set; }
        public int  consultation_id { get; set; }
        public DateTime date_consulted { get; set; }
        public string full_name { get; set; }
        public int quantity { get; set; }
        public string dosage { get; set; }

    }
    public class MedicineSupplier
    {
        public string supplier_id { get; set; }
        public string supplier_name { get; set; }
    }
    public class MedicineReceipts
    {
        public int med_id { get; set; }
        public int si_id { get; set; }
        public int stock_in_no { get; set; }
        public string invoice_no { get; set; }
        public string supplier { get; set; }
        public string status { get; set; }
        public string med_name { get; set; }
        public DateTime? date_received { get; set; }
        public int quantity { get; set; }
        public int cost { get; set; }
        public string remarks { get; set; }
        public string user { get; set; }
        public string action { get; set; }
        public List<ReceivedMedicine> list_receveived_med { get; set; }
    }
}
