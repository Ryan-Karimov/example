import moment from 'moment'
import Joi from 'joi'

export function JoiDate(format: string, msg?: string) {
    const _msg = msg ? msg : `Invalid date format! Valid date format: ${format}`;

    return Joi.string().custom((value, helpers) => {
        if (moment(value, format, true).isValid()) {
            // Invalid date
            return value;
        } else {
            return helpers.error('any.invalid');
        }
    }, 'Custom Date Validation')
        .message(_msg)
}