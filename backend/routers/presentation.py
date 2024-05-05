from fastapi import Depends, APIRouter, HTTPException, UploadFile, Request, File

from dependences import get_current_active_user, check_current_slide, get_slide_redis_data, get_viewers, get_presentation, check_pdf, get_db_session
from models import User, Presentation
from sqlalchemy.orm import Session
from services.files import generate_uuid_file_name, save_presentation_file, split_pdf_and_save_images, make_presentation_dir, remove_presentation_dir, save_slide_as_image, convert_slides_to_pdf
from services.presentations import update_presentation, create_new_presentation, delete_exist_presentation
from validation import Presentation as PresentationSchema


router = APIRouter(prefix='/presentation')


@router.post('/{uuid}/upload-image')
async def upload_background(uuid: str, file: UploadFile, current_user: User = Depends(get_current_active_user)):
    filename = generate_uuid_file_name(file.filename)

    location = await save_presentation_file(current_user.id, uuid, file, filename)

    return {'filename': location}


@router.post('/{uuid}/import-pdf')
async def import_pdf(uuid: str, file: UploadFile, current_user: User = Depends(get_current_active_user)):
    filename_pdf = generate_uuid_file_name(file.filename)

    pages = await split_pdf_and_save_images(current_user.id, uuid, file)
    if pages is None:
        raise HTTPException(status_code=400, detail='The imported file is bad')

    # images = await save_pdf_pages(current_user.id, uuid, pages, filename_pdf)

    return {'images': pages}


@router.post('/{uuid}/save')
async def save_presentation(uuid: str, p: PresentationSchema, current_user: User = Depends(get_current_active_user), session: Session = Depends(get_db_session)):
    try:
        update_presentation(uuid, p, session)
    except Exception:
        raise HTTPException(status_code=500, detail='Failed to save')


@router.post('/create')
async def create_presentation(request: Request, current_user: User = Depends(get_current_active_user), session: Session = Depends(get_db_session)):
    data = await request.json()
    if 'name' in data:
        presentation = create_new_presentation(
            data['name'], current_user, session)
        make_presentation_dir(current_user.id, presentation.uuid)

    return presentation


@router.delete('/{uuid}')
async def delete_presentation(uuid: str, current_user: User = Depends(get_current_active_user), session: Session = Depends(get_db_session)):
    delete_exist_presentation(uuid, session)
    remove_presentation_dir(current_user.id, uuid)


@router.get('/{uuid}/slide/{slide}')
async def get_slide_data(slide: int, data=Depends(get_slide_redis_data)):
    return {'data': data if data is not None else [], 'slide': slide}


@router.post('/{uuid}/slide/{slide}')
async def save_slide_image(uuid: str, slide: int, file: UploadFile, current_user: User = Depends(get_current_active_user)):
    await save_slide_as_image(current_user.id, uuid, slide, file)


@router.get('/{uuid}/export-pdf')
async def export_pdf(p: Presentation | None = Depends(get_presentation)):
    if p is None:
        raise HTTPException(status_code=404, detail='Presentation not found')

    path = convert_slides_to_pdf(p.user_id, p.uuid)

    return {'pdf': path}


@router.get('/{uuid}/for-edit')
async def get_user_presentation(current_user: User = Depends(get_current_active_user), p: Presentation | None = Depends(get_presentation), slide: int = Depends(check_current_slide)):
    if p is None:
        raise HTTPException(status_code=404, detail='Presentation not found')
    elif p.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Forbidden')

    return {'presentation': p.__dict__, 'current_slide': slide}


@router.get('/{uuid}')
async def get_presentation(p: Presentation | None = Depends(get_presentation), slide: int = Depends(check_current_slide), viewers: int = Depends(get_viewers), pdf: str | None = Depends(check_pdf)):
    if p is None:
        raise HTTPException(status_code=404, detail='Presentation not found')

    return {'presentation': p.__dict__, 'current_slide': slide, 'viewers': viewers, 'pdf': pdf}
