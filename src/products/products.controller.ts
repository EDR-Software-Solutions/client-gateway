import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.productsClient.send({ cmd: 'create_product' }, { name: createProductDto.name, price: createProductDto.price })
  }
  
  //todo ver porque da un error este find, es el validator del page, el limit anda bien
  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    console.log('FLAG', paginationDto);
    return this.productsClient.send({ cmd: 'find_all_products' },
    {  limit: paginationDto.limit, page: paginationDto.page }
    //{ paginationDto}
    )
   // return 'Esta funcion regresa varios productos';
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id:number){

    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err)})
      )

    //OTRA OPCION DE HACERLO:
   /*  try {
      
      const product = await firstValueFrom( this.productsClient.send({ cmd: 'find_one_product' }, { id }));
      return product; 

    } catch (error) {
      throw new RpcException(error);
    } */
  
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id:number){
    return this.productsClient.send({ cmd: 'delete_product' }, { id })
     .pipe(
       catchError( err => { throw new RpcException(err)})
     )
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ){
   return this.productsClient.send({ cmd: 'update_product' }, {
    id,... updateProductDto })
    .pipe(
      catchError( err => { throw new RpcException(err)})
    )
  }
}
