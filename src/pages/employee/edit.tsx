import AddEmployee from "~/Component/AddEmployee";
import {api} from '~/utils/api'
import {useRouter} from 'next/router'

const EditEmployeePage = () => {
    const router = useRouter()
    const {id} = router.query;

    const {data: employeeData} = api.employee.getEmployeeDetail.useQuery({id: Number(id)});

    if(employeeData) {
        return <AddEmployee initialData={employeeData} />;
    }
};

export default EditEmployeePage;
