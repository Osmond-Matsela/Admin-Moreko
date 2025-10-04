import { Sub } from "@radix-ui/themes/components/context-menu"
import { title } from "process"
import NavBar from "./NavBar"
import styles from "@/components/styles/StudentPortal.module.css"
import DashboardNav from "../Dashboard/DashboardNav"
import { HeartIcon, Trash } from "lucide-react"



const StudentPortal = () => {
    const BookData = [
        {
            title: "Master English",
            subject: "English",
            grade: 11,
            date : "25/06/24"
        },
        {
            title: "Master English",
            subject: "English",
            grade: 11,
            date : "25/06/24"
        },
        {
            title: "Master English",
            subject: "English",
            grade: 11,
            date : "25/06/24"
        },
        {
            title: "Master English",
            subject: "English",
            grade: 11,
            date : "25/06/24"
        },
        {
            title: "Master English",
            subject: "English",
            grade: 11,
            date : "25/06/24"
        },
        
    
        ]

    return (
        
        <div className={`mx-auto px-4 sm:px-6 lg:px-8  ${styles.styles}`}>
            <DashboardNav/>
            <h1 className={`text-8xl text-center  text-gray-900 mt-25 py-10 mb-4 `}>Good morning, Sizo </h1>
            <p className={`w-1/2 text-center mx-auto text-gray-800`}>Please feel free to find your download history in the make shift table below, it will be updated on a daily basis, please be patient. This was created by a kickass developer.</p>
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-800 rounded-md mt-10">

                            <h2 className={`text-2xl text-white text-center font-bold`}>Download History</h2>

                            <div className={`${styles.header}`}>
                            <div className="font-medium">Date</div>
                            <div>Book</div>
                            <div>Subject</div>
                            <div>Grade</div>
                            <div>Actions</div>

                        </div>
                    <div>
                        {
                        BookData.map((book,index) => (
                            <div className={`${styles.row}`} key={book.title + index}>
                                <div className="font-medium">{book.date}</div>
                                <div>{book.title}</div>
                                <div>{book.subject}</div>
                                <div >{book.grade}</div>
                                <div className={`${styles.icons}`} >
                                    <HeartIcon className="w-5 h-5 text-red-600" />
                                    <Trash className="w-5 h-5 text-red-600"/>
                                </div>
                            </div>
                            ))
                        }
                    </div>
                
            </div>
        </div>
                
    )
}

export default StudentPortal;