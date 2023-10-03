import { open } from 'lmdb'
import { logger } from './logger'
import constants from '../constants'

const getConnection = () => {
  const myDB = open({
    path: constants.DB_PATH,
    compression: true,
  })
  return myDB
}

export const setValue = (key: string, value: any): void => {
  const myDB = getConnection()
  myDB.putSync(key, value)
  myDB.close()
}

export const getValue = (key: string): string | null => {
  const myDB = getConnection()
  const value: any = myDB.get(key)
  myDB.close()
  return value
}

export const dropDB = (): Promise<void> => {
  const myDB = getConnection()
  return new Promise(() => {
    myDB
      .drop()
      .then((res) => {
        return res
      })
      .catch((err) => {
        logger.error('!!Error while removing LMDB', err.message ? err.message : err)
      })
  })
}
