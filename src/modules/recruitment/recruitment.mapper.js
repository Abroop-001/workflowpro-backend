const mapCandidateToEmployee = (

    candidate,

    employeeData

)=>{

    return {

        company: candidate.company,



        employeeId: employeeData.employeeId,



        personalInfo: {

            firstName: candidate.firstName,

            lastName: candidate.lastName,

            email: candidate.email,

            phone: candidate.phone

        },



        department: candidate.department,



        jobInfo: {

            designation: employeeData.designation,

            joiningDate: employeeData.joiningDate

        },



        salary: employeeData.salary,



        status: "ACTIVE"

    };

};





module.exports = {

    mapCandidateToEmployee

};