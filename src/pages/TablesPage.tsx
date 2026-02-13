import FinanceDashboard from "../components/FinanceDashboard"
import ResumeData from "../components/ResumeData";


export default function TablesPage() {
    console.log("TABLES PAGE MOUNT");
    return (
        <div >
            {/* BOX RIEPILOGO SUPERIORE */}
            <ResumeData />

            {/* TABELLE AFFIANCATE FULL WIDTH */}
            <FinanceDashboard />
        </div>
    );
}