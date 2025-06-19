import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMessagesComponent } from './class-messages.component';

describe('ClassMessagesComponent', () => {
  let component: ClassMessagesComponent;
  let fixture: ComponentFixture<ClassMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
