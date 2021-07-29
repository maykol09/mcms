using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface.Service
{
    public interface IReferenceExtension
    {
        IReadOnlyCollection<LibMedicine> MedicineMapper(DataTable data);
        IReadOnlyCollection<LibSupplier> SupplierMapper(DataTable data);
        IReadOnlyCollection<LibReasonForVisit> ReasonMapper(DataTable data);
        IReadOnlyCollection<LibUser> UserMapper(DataTable data);
    }
}
