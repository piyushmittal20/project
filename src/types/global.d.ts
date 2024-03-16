import {type RouterOutputs} from '../utils/api'

declare global {
    export type Employees = RouterOutputs['employee']['listEmployees']
    export type EmployeeData = RouterOutputs['employee']['getEmployeeDetail']
    export type Dependents = RouterOutputs['dependent']['listDependents']

    export type Employee = Employees[number]
    export type Dependent = Dependents[number]
}