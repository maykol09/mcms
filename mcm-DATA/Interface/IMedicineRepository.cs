using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IMedicineRepository
    {
        DataTable GetMedicines();
        MedicineDetails GetMedicineDetails(int med_id);
        int SaveMedicineDetails(MedicineDetails data);
        IReadOnlyCollection<ReceivedMedicine> GetReceivedMed(int med_id);
        IReadOnlyCollection<IssuedMedicine> GetIssuedMed(int med_id);
        void DeleteMedicine(int med_id);
    }

}
