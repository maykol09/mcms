using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IReceiptsRepository
    {
        IReadOnlyCollection<MedicineReceipts> GetReceipts(string from, string to);
        int SaveReceipts(MedicineReceipts data);
        IReadOnlyCollection<ReceivedMedicine> GetStockMedicine(int si_id);
        void DeleteReceipts(int si_id);
    }
}
