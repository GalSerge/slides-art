import os
import shortuuid
import shutil
import img2pdf
import pypdfium2 as pdfium

from pdf2image import convert_from_bytes
from random import randint
from tempfile import SpooledTemporaryFile


def get_file_extension(filename: str) -> str:
    file_params = os.path.splitext(filename)

    return file_params[1]


def get_presentation_dir(user_id: int, uuid: str):
    return f'storage/users/{user_id}/presentations/{uuid}'


def generate_uuid_file_name(filename: str) -> str:
    extension = get_file_extension(filename)
    new_filename = shortuuid.uuid(name=filename)[:5]

    return new_filename + extension


async def save_presentation_file(user_id: int, uuid: str, file: SpooledTemporaryFile, filename: str) -> None:
    location = get_presentation_dir(user_id, uuid) + f'/{filename}'
    with open(location, 'wb+') as file_object:
        file_object.write(await file.read())

    return location


# async def split_pdf(file: SpooledTemporaryFile) -> list | None:
#     try:
#         return convert_from_bytes(await file.read(), dpi=600)
#     except Exception:
#         return None
    

async def split_pdf_and_save_images(user_id: int, uuid: str, file: SpooledTemporaryFile) -> list | None:
    location = get_presentation_dir(user_id, uuid)
    images = []

    try:
        pdf = pdfium.PdfDocument(await file.read())
    except Exception:
        return None
    
    for i in range(len(pdf)):
        page = pdf[i]
        image = page.render(scale=2).to_pil()
        filename = generate_uuid_file_name(
            f'{file.filename}_{randint(0, 10)}_{i}.png')
        filename = f'{location}/{filename}'

        image.save(filename)

        images.append(filename)

    return images


# async def save_pdf_pages(user_id: int, uuid: str, pages: list, filename_pdf: str) -> list:
#     location = get_presentation_dir(user_id, uuid)
#     images = []
#     for i, page in enumerate(pages):
#         filename = generate_uuid_file_name(
#             f'{filename_pdf}_{randint(0, 10)}_{i}.png')
#         filename = f'{location}/{filename}'

#         page.save(filename)

#         images.append(filename)

#     return images


def make_presentation_dir(user_id: int, uuid: str):
    path = get_presentation_dir(user_id, uuid)
    os.mkdir(path)

    path += '/slides'
    os.mkdir(path)


def remove_presentation_dir(user_id: int, uuid: str):
    path = get_presentation_dir(user_id, uuid)
    shutil.rmtree(path)


def make_user_dir(user_id):
    path = f'storage/users/{user_id}'
    os.mkdir(path)

    path += '/presentations'
    os.mkdir(path)


def remove_user_dir(user_id):
    path = f'storage/users/{user_id}'
    shutil.rmtree(path)


async def save_slide_as_image(user_id: int, uuid: str, slide: int, image: SpooledTemporaryFile):
    location = get_presentation_dir(user_id, uuid) + f'/slides/{slide}.png'

    if os.path.exists(location): 
        os.remove(location)

    with open(location, 'wb+') as file_object:
        file_object.write(await image.read())


def slide_to_int(slide: str):
    return int(slide.replace('.png', ''))


def convert_slides_to_pdf(user_id: int, uuid: str) -> str:
    slides_location = get_presentation_dir(user_id, uuid) + '/slides'
    pdf_location = f'storage/presentations/{uuid}.pdf'

    if os.path.exists(pdf_location) and os.path.getmtime(slides_location) < os.path.getmtime(pdf_location):
        return pdf_location

    slides = os.listdir(slides_location)
    slides.sort(key=slide_to_int)
    slides = [os.path.join(slides_location, file) for file in slides]
    pdf_file = img2pdf.convert(slides)

    with open(pdf_location, 'wb') as file:
        file.write(pdf_file)

    return pdf_location


def check_pdf(uuid: str):
    pdf_location = f'storage/presentations/{uuid}.pdf'
    if os.path.exists(pdf_location):
        return pdf_location
    else:
        return None
