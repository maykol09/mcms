using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IPersonDetailsRepository
    {
        DataTable GetPersonDetails(int person_id);
        int SavePersonDetails(PersonDetails data);
        PersonDetails GetPersonDetailsById(int person_id);
    }
}
