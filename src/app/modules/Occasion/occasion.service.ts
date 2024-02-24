import { OccasionModel } from './occasion.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TOccasion } from './occasion.interface';

const createOccasionIntoDB = async (occasion: TOccasion) => {
    const isOccasionExist = await OccasionModel.findOne({
        name: occasion.name.toLowerCase(),
    });
    if (isOccasionExist) {
        throw new AppError(httpStatus.CONFLICT, 'Occasion already exist');
    }

    const occasionCreated = await OccasionModel.create({
        name: occasion.name.toLowerCase(),
    });
    return occasionCreated;
};

const getAllOccasionsFromDB = async () => {
    const occasions = await OccasionModel.find({ isDeleted: false });
    return occasions;
};

export const OccasionServices = {
    createOccasionIntoDB,
    getAllOccasionsFromDB,
};
