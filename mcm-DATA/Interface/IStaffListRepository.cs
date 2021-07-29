using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IStaffListRepository
    {
        DataTable GetStaffList(string staff);
        void DeleteStaff(int person_id);
    }
}
