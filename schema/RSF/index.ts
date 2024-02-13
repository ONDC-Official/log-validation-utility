import Joi from 'joi'

import { settle } from './settle'
import { onSettle } from './onSettle'
import { receiverRecon } from './receiverRecon'
import { onReceiverRecon } from './onReceiverRecon'

export const RSFPayload: Joi.ObjectSchema = Joi.object({
  settle,
  on_settle: onSettle,
  receiver_recon: receiverRecon,
  on_receiver_recon: onReceiverRecon,
})
