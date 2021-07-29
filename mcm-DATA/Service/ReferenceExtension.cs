using mcm_DATA.Entities;
using mcm_DATA.Interface.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Service
{
    public class ReferenceExtension : IReferenceExtension
    {
        public IReadOnlyCollection<LibMedicine> MedicineMapper(DataTable data)
        {
            var medicine_list = new List<LibMedicine>();
            foreach(DataRow row in data.Rows)
            {
                var medicine = new LibMedicine();
                medicine.med_id = Convert.ToInt32(row["med_id"]);
                medicine.med_name = row["med_name"].ToString();
                medicine.onhand = Convert.ToInt32(row["onhand"].ToString() == DBNull.Value.ToString() ? 0 : row["onhand"]);
                medicine.is_active = Convert.ToBoolean(row["is_active"]);
                medicine_list.Add(medicine);
            }
            return medicine_list;
        }
        public IReadOnlyCollection<LibSupplier> SupplierMapper(DataTable data)
        {
            var supplier_list = new List<LibSupplier>();
            foreach (DataRow row in data.Rows)
            {
                var supplier = new LibSupplier();
                supplier.supplier_id = row["ref_code"].ToString();
                supplier.supplier_name = row["ref_desc"].ToString();
                supplier_list.Add(supplier);
            }
            return supplier_list;
        }

        public IReadOnlyCollection<LibReasonForVisit> ReasonMapper(DataTable data)
        {
            var reason_list = new List<LibReasonForVisit>();
            foreach (DataRow row in data.Rows)
            {
                var reason = new LibReasonForVisit();
                reason.reason_id = Convert.ToInt32(row["ref_id"]);
                reason.reason = row["ref_desc"].ToString();
                reason_list.Add(reason);
            }
            return reason_list;
        }
        public IReadOnlyCollection<LibUser> UserMapper(DataTable data)
        {
            var user_list = new List<LibUser>();
            foreach (DataRow row in data.Rows)
            {
                var user = new LibUser();
                user.person_id = Convert.ToInt32(row["person_id"]);
                user.user_name = row["user_name"].ToString();
                user.name = row["name"].ToString();
                user_list.Add(user);
            }
            return user_list;
        }
    }
}
