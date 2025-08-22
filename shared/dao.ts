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

export const getValue = (key: string): any => {
  const myDB = getConnection()
  const value: any = myDB.get(key)
  myDB.close()
  return value
}

export const dropDB = async (): Promise<void> => {
  const myDB = getConnection()
  try {
    await myDB.drop()
    myDB.close()
  } catch (err) {
    logger.error('!!Error while removing LMDB', err instanceof Error ? err.message : err)
    myDB.close()
    // Re-throw the error to ensure proper error handling
    throw err
  }
}
