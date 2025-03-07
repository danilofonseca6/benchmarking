import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {motion} from 'framer-motion';


// const salesData = [
//     { name: "Jul", sales: 4200 },
//     { name: "Aug", sales: 3800 },
//     { name: "Sep", sales: 5100 },
//     { name: "Oct", sales: 4600 },
//     { name: "Nov", sales: 5400 },
//     { name: "Dec", sales: 7200 },
//     { name: "Jan", sales: 6100 },
//     { name: "Feb", sales: 5900 },
//     { name: "Mar", sales: 6800 },
//     { name: "Apr", sales: 6300 },
//     { name: "May", sales: 7100 },
//     { name: "Jun", sales: 7500 },
// ];

// {category: 'Upholding the firm’s core values', value: 4.857142857142857},
// {category: 'Achieving financial milestonest', value: 4.857142857142857},
// {category: 'Leaving a lasting legacy ', value: 4.785714285714286},
// {category: 'Driving innovation ', value: 4.285714285714286},
// {category: 'Empowering and mentoring', value: 4.214285714285714},
// {category: 'Achieving personal growth ', value: 3},
// {category: 'Personal financial security', value: 2}
const motivationFactors = [
    {category: 'Option:1',text:'Upholding the firm’s core values', value: 4.9},
    {category: 'Option:2',text:'Achieving financial milestones', value: 4.9},
    {category: 'Option:3',text:'Leaving a lasting legacy', value: 4.8},
    {category: 'Option:4',text:'Driving innovation ', value: 4.3},
    {category: 'Option:5',text:'Empowering and mentoring', value: 4.2},
    {category: 'Option:6',text:'Achieving personal growth ', value: 3},
    {category: 'Option:7',text:'Personal financial security', value: 2}


]
// ✅ Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { text, value } = payload[0].payload; // Get text & value
        return (
            <div className='bg-gray-800 text-gray-100 p-2 rounded-md border border-gray-700'>
                <p className='font-semibold'>{text}</p>
                <p>Value: {value}</p>
            </div>
        );
    }
    return null;
};

const SalesOverviewChart = () => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Factors that motivate you, personally and professionally</h2>
            <div className='h-80'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={motivationFactors}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                        <XAxis dataKey={"category"} stroke='#9ca3af' fontSize={10} />
                        <YAxis stroke='#9ca3af' />
                        <Tooltip content={<CustomTooltip />} />
                        {/*<Tooltip*/}
                        {/*    contentStyle={{*/}
                        {/*        backgroundColor: "rgba(31, 41, 55, 0.8)",*/}
                        {/*        borderColor: "#4B5563",*/}
                        {/*    }}*/}
                        {/*    dataKey='text'*/}
                        {/*    itemStyle={{ color: "#E5E7EB" }}*/}
                        {/*/>*/}
                        <Line
                            type='monotone'
                            dataKey='value'
                            stroke='#6366F1'
                            strokeWidth={3}
                            dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}
export default SalesOverviewChart;
