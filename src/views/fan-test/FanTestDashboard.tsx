import api from '@/api/axios'
import { FanTestBlock } from '@/components/FanTestBlock'
import { Button } from '@/components/ui/button'
import { BlockData } from '@/types'
import { Eraser, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import { useTranslation } from 'react-i18next'

const FanTestDashboard = () => {
	const [fanStatistics, setFanStatistics] = useState<BlockData[]>([])
	const { t } = useTranslation()
	const handleCleanStats = () => {
		api.delete('/api/v1/user/statistics/delete-by-type/100').then(() => {
			getFanStats()
		})
	}
	const allStatsAreZero = fanStatistics.every(
		stat =>
			stat.wrong_answer === 0 &&
			stat.correct_answer === 0 &&
			stat.skipped_answer === 0
	)

	const getFanStats = () => {
		api.get('/api/v1/user/statistics?type=100').then(res => {
			setFanStatistics(res.data.data)
		})
	}

	useEffect(() => {
		getFanStats()
	}, [])

	if (!fanStatistics.length) {
		return (
			<MainLayout>
				<Loader2
					color='white'
					size={70}
					className='animate-spin h-[calc(100vh-150px)] mx-auto'
				/>
			</MainLayout>
		)
	}

	return (
		<MainLayout>
			<div className='flex flex-col gap-3.5'>
				{!allStatsAreZero && (
					<Button className='self-end' size={'sm'} onClick={handleCleanStats}>
						{t('clean_stats')}
						<Eraser />
					</Button>
				)}
				<div className='flex justify-center flex-wrap gap-3.5'>
					{fanStatistics.map(test => (
						<FanTestBlock key={test.id} data={test} />
					))}
				</div>
			</div>
		</MainLayout>
	)
}

export default FanTestDashboard
