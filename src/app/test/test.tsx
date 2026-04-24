import { LogicContainer1, LogicContainer2 } from "./test";

// Logika Menampilkan Data & View

function ViewContainer1() {
    const ViewData1 = LogicContainer1();
    return (
        <div>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <th>{ViewData1.map(item => item.id).join(', ')}</th>
                    <th>{ViewData1.map(item => item.name).join(', ')}</th>
                    <th>{ViewData1.map(item => item.description).join(', ')}</th>
                    <th>{ViewData1.map(item => item.date).join(', ')}</th>
                    <th>{ViewData1.map(item => item.status).join(', ')}</th>
                </tr>
            </table>
        </div>
    )
}

function ViewContainer2() {
    const ViewData2 = LogicContainer2();
    return (
        <div>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <th>{ViewData2.map(item => item.id).join(', ')}</th>
                    <th>{ViewData2.map(item => item.name).join(', ')}</th>
                    <th>{ViewData2.map(item => item.description).join(', ')}</th>
                    <th>{ViewData2.map(item => item.date).join(', ')}</th>
                    <th>{ViewData2.map(item => item.status).join(', ')}</th>
                </tr>
            </table>
        </div>
    )
}

function FinalView(){
    return (
        <div>
            <ViewContainer1 />
            <ViewContainer2 />
        </div>
    )
}

export default FinalView;