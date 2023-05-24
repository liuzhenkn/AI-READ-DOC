import dayjs from 'dayjs'

export const formatTime = (time, regex) => dayjs(time).format(regex || 'YYYY-MM-DD HH:mm:ss')
